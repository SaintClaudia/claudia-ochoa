(function(){
  var POLL_WORKER_URL = 'https://portfolio-poll.claudiajochoa.workers.dev';

  document.querySelectorAll('.poll-block[data-poll-id]').forEach(function(block){
    var pollId = block.getAttribute('data-poll-id');
    var buttons = Array.prototype.slice.call(block.querySelectorAll('.poll-btn'));
    var countEl = block.querySelector('.poll-count');
    var statusEl = block.querySelector('.poll-status');
    var storageKey = 'poll_vote_' + pollId;
    var voted = false;

    if(!buttons.length || !countEl || !statusEl) return;

    function render(tally){
      var total = buttons.reduce(function(sum, btn){
        return sum + (tally[btn.getAttribute('data-choice')] || 0);
      }, 0);

      buttons.forEach(function(btn){
        var count = tally[btn.getAttribute('data-choice')] || 0;
        var pct = total > 0 ? Math.round((count / total) * 100) : 0;
        btn.querySelector('.poll-btn-pct').textContent = total > 0 ? pct + '%' : '—';
        btn.querySelector('.poll-btn-fill').style.width = pct + '%';
      });
      countEl.textContent = total + (total === 1 ? ' vote so far' : ' votes so far');
    }

    function lockButtons(selectedChoice){
      voted = true;
      buttons.forEach(function(btn){
        btn.disabled = true;
        btn.classList.toggle('selected', btn.getAttribute('data-choice') === selectedChoice);
      });
      statusEl.textContent = 'thanks for voting';
    }

    function fetchTally(){
      fetch(POLL_WORKER_URL + '/poll/' + encodeURIComponent(pollId))
        .then(function(response){ return response.json(); })
        .then(function(tally){ render(tally || {}); })
        .catch(function(){});
    }

    buttons.forEach(function(btn){
      btn.addEventListener('click', function(){
        if(voted) return;
        var choice = btn.getAttribute('data-choice');
        lockButtons(choice);
        try{ localStorage.setItem(storageKey, choice); }catch(error){}
        fetch(POLL_WORKER_URL + '/poll/' + encodeURIComponent(pollId), {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({choice: choice})
        })
          .then(function(response){ return response.json(); })
          .then(function(tally){ render(tally || {}); })
          .catch(function(){});
      });
    });

    var previousVote = null;
    try{ previousVote = localStorage.getItem(storageKey); }catch(error){}
    if(previousVote) lockButtons(previousVote);
    fetchTally();
  });
})();
